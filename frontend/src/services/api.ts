// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // URL base do seu backend Django
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProdutos = async () => {
  try {
    const response = await api.get('/produtos/');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
};

// src/services/api.ts
export const sendProduto = async (produto: { nome: string; preco: string; estoque: string; imagem: File }) => {
     const formData = new FormData();
     formData.append('nome', produto.nome);
     formData.append('preco', produto.preco);
     formData.append('estoque', produto.estoque);
     formData.append('imagem', produto.imagem);  // Adiciona o arquivo de imagem
   
     try {
       const response = await api.post('/produtos/', formData, {
         headers: {
           'Content-Type': 'multipart/form-data',  // Define o tipo de conteúdo como multipart/form-data
         },
       });
       return response.data;
     } catch (error) {
       console.error('Erro ao enviar produto:', error.response?.data);
       throw error;
     }
   };

// src/services/api.ts
export const deleteProduto = async (id: number) => {
     try {
       const response = await api.delete(`/produtos/${id}/`);
       return response.data;
     } catch (error) {
       console.error('Erro ao deletar produto:', error.response?.data);
       throw error;
     }
   };