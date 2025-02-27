// src/app/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { getProdutos, sendProduto, deleteProduto } from '../services/api'; // Importando ambas as funções
import styles from './page.module.css'; // Importando o arquivo CSS

// Definir tipo de produto
interface Produto {
  id: number;
  nome: string;
  preco: string;
  estoque: string;
  imagem: File | null;
}

const Page: React.FC = () => {
  const [data, setData] = useState<Produto[] | null>(null); // Tipando o estado
  const [produto, setProduto] = useState<Produto>({
    id: 0, // ou outro valor padrão
    nome: '',
    preco: '',
    estoque: '',
    imagem: null, // Inicialmente, nenhum arquivo é selecionado
  });
  const [message, setMessage] = useState<string>('');

  // Carregar dados do backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const produtos = await getProdutos(); // Supondo que getProdutos retorne um array de Produtos
        setData(produtos);
      } catch (error) {
        console.error('Erro ao conectar ao backend:', error);
      }
    };

    fetchData();
  }, []);

  // Função para lidar com o envio de produto
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede o comportamento padrão de enviar o formulário

    try {
      const response = await sendProduto(produto);  // Envia o produto para o backend
      setMessage('Produto enviado com sucesso!');
      setData((prevData) => [...(prevData || []), response]); // Atualiza a lista de produtos com o novo produto enviado
      setProduto({ nome: '', preco: '', estoque: '', imagem: '' }); // Limpa os campos do formulário
    } catch (error) {
      setMessage('Falha ao enviar o produto.');
    }
  };

  // Função para atualizar o estado dos campos de formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduto((prev) => ({
      ...prev,
      [name]: value,  // Atualiza o estado conforme o campo do formulário
    }));
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduto(id);  // Chama a função para deletar o produto
      setMessage('Produto deletado com sucesso!');
      // Atualiza a lista de produtos, removendo o produto deletado
      setData((prevData) => prevData?.filter((produto) => produto.id !== id) || null);
    } catch (error) {
      setMessage('Falha ao deletar o produto.');
    }
  };

  return (
    <div className={styles.produtos}>
      {/* Formulário de envio de produto */}
      <h1 className={styles.titulo}>Adicionar Novo Produto</h1>
      <form onSubmit={handleSubmit} className={styles.formulario}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nome:</label>
          <input
            type="text"
            name="nome"
            value={produto.nome}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Preço:</label>
          <input
            type="text"
            name="preco"
            value={produto.preco}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Estoque:</label>
          <input
            type="text"
            name="estoque"
            value={produto.estoque}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Imagem:</label>
          <input
          type="file"
          name="imagem"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setProduto((prev) => ({
                ...prev,
                imagem: e.target.files[0],  // Armazena o arquivo selecionado
              }));
            }
          }}
          required
          className={styles.input}
        />
        </div>
        <button type="submit" className={styles.botao}>Enviar</button>
      </form>

      {/* Mensagem de sucesso ou erro */}
      {message && <p>{message}</p>}

      {/* Exibição da lista de produtos */}
      <h1 className={styles.titulo}>Produtos</h1>
      <ul className={styles.listaProdutos}>
        {data?.map((produto) => (
          <li key={produto.id} className={styles.produtoItem}>
            <strong className={styles.produtoNome}>{produto.nome}</strong>
            <div className={styles.produtoInfo}>
              <p><strong>Preço:</strong> {produto.preco}</p>
              <p><strong>Estoque:</strong> {produto.estoque}</p>
              <p><strong>Imagem:</strong></p>
              <img className={styles.produtoImagem} src={produto.imagem} alt={produto.nome} />
            </div>
            <button
              onClick={() => handleDelete(produto.id)}  // Chama a função de exclusão
              className={styles.botaoDeletar}
            >
              Deletar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
