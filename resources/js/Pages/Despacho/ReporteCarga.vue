<template>
  <div class="p-8 max-w-2xl mx-auto bg-white shadow-lg" id="print-area">
    <h1 class="text-2xl font-bold border-b pb-2">ORDEN DE CARGA #{{ despacho.id }}</h1>
    <p class="mt-2"><strong>Chofer:</strong> {{ despacho.chofer.user.name }}</p>
    <p><strong>Placa:</strong> {{ despacho.placa_vehiculo }}</p>
    
    <table class="w-full mt-6 border-collapse">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-2 text-left">Producto</th>
          <th class="border p-2 text-center">Cantidad a Cargar</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in resumen" :key="item.nombre">
          <td class="border p-2">{{ item.nombre }}</td>
          <td class="border p-2 text-center font-bold text-xl">{{ item.total_cantidad }}</td>
        </tr>
      </tbody>
    </table>

    <h2 class="text-xl font-bold mt-8 border-b pb-2">HOJA DE RUTA (Entregas)</h2>
<table class="w-full mt-4 border-collapse">
  <thead>
    <tr class="bg-gray-100">
      <th class="border p-2 text-left">Orden</th>
      <th class="border p-2 text-left">Cliente / Negocio</th>
      <th class="border p-2 text-left">Dirección</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(pedido, index) in clientes" :key="pedido.id">
      <td class="border p-2 text-center">{{ index + 1 }}</td>
      <td class="border p-2 font-bold">{{ pedido.punto_venta.nombre_negocio }}</td>
      <td class="border p-2 text-sm">{{ pedido.punto_venta.direccion }}</td>
    </tr>
  </tbody>
</table>

    <button @click="print" class="mt-6 bg-blue-600 text-white px-4 py-2 rounded no-print">
      Imprimir Reporte
    </button>
  </div>
</template>

<script setup>
defineProps(['despacho', 'resumen']);
const print = () => window.print();
</script>

<style>
@media print { .no-print { display: none; } }
</style>