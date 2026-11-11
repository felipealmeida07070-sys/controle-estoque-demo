const catalogo = [
  ['Pão de forma', 5, 8.50, 20, 8, 9],
  ['Leite integral 1 L', 3.80, 5.90, 12, 8, 7],
  ['Salgadinho de milho', 2, 3.50, 15, 8, 4],
  ['Arroz 1 kg', 4, 6.90, 18, 8, 3],
  ['Feijão carioca 1 kg', 5, 8.50, 16, 8, 2],
  ['Macarrão 500 g', 2.50, 4.50, 15, 8, 3],
  ['Biscoito recheado', 1.80, 3.20, 18, 8, 5],
  ['Café moído 250 g', 9, 14.90, 10, 6, 2],
  ['Suco de laranja 1 L', 4, 7.50, 12, 6, 3],
  ['Açúcar 1 kg', 3, 5.20, 15, 6, 2]
];

const parceiros = ['Padaria Escola', 'Distribuidora Escola', 'Mercearia Escola'].map((nome, indice) => ({
  id: indice + 1, nome_fantasia: nome, razao_social: nome + ' Demonstração',
  cnpj: ['90000000000134', '90000000000215', '90000000000304'][indice],
  telefone: '(00) 0000-0000', email: 'demo' + (indice + 1) + '@example.invalid', ativo: true
}));

const produtosDemo = catalogo.map(([nome, custo, preco, entrada, minimo, venda], indice) => ({
  id: indice + 1, nome, custo, preco, sku: 'DEMO-' + String(indice + 1).padStart(2, '0'),
  saldo: entrada - venda, estoque_minimo: minimo, saidas: venda, em_transito: 0
}));

const movimentosDemo = produtosDemo.flatMap((produto, indice) => {
  const registro = { sku: produto.sku, nome: produto.nome, usuario: 'Equipe de demonstração',
    custo_unitario: produto.custo, criado_em: '2026-11-11 16:00:00' };
  return [
    { ...registro, tipo: 'entrada', quantidade: catalogo[indice][3], nota_fiscal: 'NF-' + produto.sku,
      fornecedor: parceiros[indice === 0 ? 0 : indice < 3 ? 1 : 2].nome_fantasia },
    { ...registro, tipo: 'venda', quantidade: produto.saidas, preco_unitario: produto.preco,
      pagamento: ['pix', 'debito', 'credito', 'vale'][indice % 4] }
  ];
});

const pedidosDemo = [
  [1, 3, 1, 'parcial'], [2, 5, 0, 'em_transito'], [0, 4, 4, 'recebido']
].map(([indice, quantidade, recebida, status], ordem) => {
  const produto = produtosDemo[indice];
  const fornecedor = parceiros[indice === 0 ? 0 : 1];
  produto.saldo += recebida;
  produto.em_transito += quantidade - recebida;
  if (recebida) movimentosDemo.push({
    sku: produto.sku, nome: produto.nome, usuario: 'Equipe de demonstração', tipo: 'entrada',
    quantidade: recebida, custo_unitario: produto.custo, nota_fiscal: 'NF-DEMO-PED-' + (ordem + 1),
    fornecedor: fornecedor.nome_fantasia, criado_em: '2026-11-11 17:00:00'
  });
  return {
    id: ordem + 1, status, entrega_prevista: '2026-11-14', condicoes_pagamento: 'Pix na entrega',
    fornecedor: fornecedor.nome_fantasia, razao_social: fornecedor.razao_social, cnpj: fornecedor.cnpj,
    email: fornecedor.email, itens: [{ id: ordem + 1, nome: produto.nome, sku: produto.sku, quantidade, recebida }]
  };
});

const financeiroDemo = { faturamento: 0, compras: 0, lucro: 0, vendas_sem_custo: 0 };
for (const movimento of movimentosDemo) {
  if (movimento.tipo === 'entrada') financeiroDemo.compras += movimento.quantidade * movimento.custo_unitario;
  if (movimento.tipo === 'venda') {
    financeiroDemo.faturamento += movimento.quantidade * movimento.preco_unitario;
    financeiroDemo.lucro += movimento.quantidade * (movimento.preco_unitario - movimento.custo_unitario);
  }
}

const dadosDemo = {
  sessao: { nome: 'Demonstração', perfil: 'administrador' },
  produtos: produtosDemo, fornecedores: parceiros, movimentacoes: movimentosDemo.reverse(),
  pedidos: { empresa: 'Mercado Escola', pedidos: pedidosDemo.reverse() }, relatorio: financeiroDemo
};
