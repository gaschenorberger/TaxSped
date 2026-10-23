export function resultKey(order, output, index) {
  return `${order.protocol}/resultado-${output.id || index}`;
}

export function getResults(orders) {
  return orders.filter(order => !order.deleted).flatMap(order => (order.outputs || []).map((output, index) => ({ ...output, id: output.id || resultKey(order, output, index), protocol: resultKey(order, output, index), orderProtocol: order.protocol, orderName: order.name?.startsWith('Pedido ') ? order.name : order.protocol, generated: true, sped: order.sped, conversion: order.conversion, status: output.status || 'Concluído', date: output.date || order.date, type: output.type || output.name.split('.').pop().toUpperCase() })));
}

export function changeResults(orders, keys, changes) {
  return orders.map(order => ({ ...order, outputs: (order.outputs || []).map((output, index) => keys.includes(resultKey(order, output, index)) ? { ...output, ...changes } : output) }));
}
