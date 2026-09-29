/**
 * En móvil abre el menú de compartir del sistema (como el Intent de Android);
 * en escritorio, o si no hay soporte, descarga el archivo.
 */
export async function shareOrDownload(content: string, filename: string, title: string): Promise<void> {
  const file = new File([content], filename, { type: 'text/csv' })
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches

  if (isTouchDevice && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title })
      return
    } catch (error) {
      // El usuario canceló: no descargar.
      if ((error as DOMException)?.name === 'AbortError') return
    }
  }

  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
