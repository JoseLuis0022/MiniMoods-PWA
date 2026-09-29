// Fecha seleccionada; vive fuera de las rutas para conservarse al volver de Ajustes
// (equivale al MoodViewModel.selectedDate de Android).
export const selection = $state({ date: new Date() })
