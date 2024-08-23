import { BiSolidFilePdf } from 'react-icons/bi'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import QRCode from 'qrcode'
import { formatCurrency, formatDate, formatId } from '@/helpers'
import styles from './ReciboPDF.module.css'

export function ReciboPDF(props) {

  const {cliente, recibos, conceptos, reciboNota, firma} = props
  
  const generarPDF = async () => {

    if (!recibos) return

    const toggleIVA = JSON.parse(localStorage.getItem('ontoggleIVA') || 'true')

    const doc = new jsPDF(
      {
        orientation: 'p',
        unit: 'mm',
        format: 'a6'
      }
    )

    const logoImg = 'img/logo.png'
    const logoWidth = 36
    const logoHeight = 10
    const marginRightLogo = 4.5

    const pageWidth = doc.internal.pageSize.getWidth()

    const xPosition = pageWidth - logoWidth - marginRightLogo

    doc.addImage(logoImg, 'PNG', xPosition, 12, logoWidth, logoHeight)
    
    doc.addImage(logoImg, 'PNG', xPosition, 12, logoWidth, logoHeight)

    doc.setFont('helvetica')

    const marginRight = 4.5
    const font1 = 10
    const font2 = 9
    const font3 = 8

    doc.setFontSize(`${font1}`)
    doc.setTextColor(0, 0, 0)
    doc.text('CLICKNET', 4.5, 10)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text('Punta Este Corporativo', 4.5, 14)
    doc.text('Calzada Carranza 951', 4.5, 18)
    doc.text('Piso 10 Suite 304, Interior "E"', 4.5, 22)
    doc.text('C.P. 2125', 4.5, 26)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(0, 0, 0)
    doc.text('Juan Roberto Espinoza Espinoza', 4.5, 30)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text('RFC: EIEJ8906244J3', 4.5, 34)

    doc.setFontSize(`${font1}`)
    doc.setTextColor(0, 0, 0)
    doc.text('Cliente', 4.5, 40)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text(`${recibos.cliente}`, 4.5, 44)

    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text('R E C I B O', doc.internal.pageSize.width - marginRight - doc.getTextWidth('R E C I B O'), 34)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(0, 0, 0)
    doc.text('Folio', doc.internal.pageSize.width - marginRight - doc.getTextWidth('Folio'), 40)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text(`${formatId(recibos.id)}`, doc.internal.pageSize.width - marginRight - doc.getTextWidth(`${formatId(recibos.id)}`), 44)

    doc.setFontSize(`${font1}`)
    doc.setTextColor(0, 0, 0)
    doc.text('Contacto', 4.5, 49)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text(`${cliente.contacto}`, 4.5, 53)

    doc.setFontSize(`${font2}`)
    doc.setTextColor(0, 0, 0)
    doc.text('Fecha/Hora', doc.internal.pageSize.width - marginRight - doc.getTextWidth('Fecha/Hora'), 49)
    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    doc.text(
      `${formatDate(recibos.createdAt).toUpperCase()}`,
      doc.internal.pageSize.width - 3.9 - doc.getTextWidth(`${formatDate(recibos.createdAt)}`),
      53
    )

    doc.autoTable({
      startY: 58,
      head: [
        [
          { content: 'Tipo', styles: { halign: 'center' } },
          { content: 'Concepto', styles: { halign: 'left' } },
          { content: 'Precio', styles: { halign: 'right' } },
          { content: 'Qty', styles: { halign: 'center' } },
          { content: 'Total', styles: { halign: 'right' } },         
        ]
      ],
      styles: {
        cellPadding: 1,
        cellWidth: 'auto',
      },
      body: conceptos.map(concepto => [
        { content: `${concepto.tipo}`, styles: { halign: 'center' } }, 
        { content: `${concepto.concepto}`, styles: { halign: 'left' } }, 
        { content: `$${formatCurrency(concepto.precio * 1)}`, styles: { halign: 'right' } },  
        { content: `${concepto.cantidad}`, styles: { halign: 'center' } },  
        { content: `$${formatCurrency(concepto.precio * concepto.cantidad)}`, styles: { halign: 'right' } },  
        ]),
      headStyles: { fillColor: [0, 150, 170], fontSize: `${font3}`},
      bodyStyles: { fontSize: 7},
      columnStyles: {
        0: { cellWidth: 16 },  
        1: { cellWidth: 40 },  
        2: { cellWidth: 14 }, 
        3: { cellWidth: 12 },  
        4: { cellWidth: 14 },  

        cellPadding: 1,      
        valign: 'middle'    
    },

      margin: { top: 0, left: 4.5, bottom: 0, right: 4.5 },

    })

    const calcularTotales = () => {
      const subtotal = conceptos.reduce((acc, curr) => acc + curr.cantidad * curr.precio, 0)
      const iva = subtotal * 0.16
      const total = toggleIVA ? subtotal + iva : subtotal
      return { subtotal, iva, total }
    }
  
    const { subtotal, iva, total } = calcularTotales()

    const margin = 4.5
    const top = 108
    const boxWidth = 65
    const boxHeight = 8

    doc.setDrawColor(255, 255, 255)
    doc.rect(margin, top, boxWidth, boxHeight)

    doc.setFontSize(6.8);
    doc.setTextColor(0, 0, 0);
    doc.text('Nota:', margin, top + 1)

    doc.setFontSize(6.5)
    doc.setTextColor(120, 120, 120)
    const content = reciboNota === undefined ? (
      `${recibos.nota}`
    ) : (
      `${reciboNota}`
    )
      

    const textX = margin
    const textY = top + 4
    const txtWidth = boxWidth - 4

    doc.text(content, textX, textY, { maxWidth: txtWidth })

    const verticalData = [
      ...toggleIVA ? [
        ['Subtotal:', `$${formatCurrency(subtotal)}`],
        ['IVA:', `$${formatCurrency(iva)}`],
      ] : [],
      ['Total:', `$${formatCurrency(total)}`]
    ]
    
    const pWidth = doc.internal.pageSize.getWidth()
    const mRight = 4.5
    const tableWidth = 33
    const marginLeft = pWidth - mRight - tableWidth

    doc.autoTable({
      startY: 106.5,
      margin: { left: marginLeft, bottom: 0, right: marginRight },
      body: verticalData,
      styles: {
        cellPadding: 1,
        valign: 'middle',
        fontSize: `${font3}`,
      },
      columnStyles: {
        0: { cellWidth: 15, fontStyle: 'bold', halign: 'right' },
        1: { cellWidth: 18, halign: 'right' }  
      }
    })

    const firmaWidth = 20
    const firmaHeight = 10
    const marginRightFirma = 9.5

    const pgWidth = doc.internal.pageSize.getWidth()

    const xPos = pgWidth - firmaWidth - marginRightFirma

    if (firma) {
      doc.addImage(firma, 'PNG', xPos, 126.5, firmaWidth, firmaHeight) 
      doc.setFontSize(6)
      doc.setTextColor(50, 50, 50)
      doc.text('_________________________', doc.internal.pageSize.width - 29 - doc.getTextWidth('Firma'), 138)  
      doc.text('Firma', doc.internal.pageSize.width - 16.5 - doc.getTextWidth('Firma'), 141.5)  
    }

    doc.setFontSize(6)
    doc.setTextColor(120, 120, 120)
    doc.text('• Pago en pesos.', 27, 124)
    doc.text('• Todos nuestros equipos cuentan con', 27, 127)
    doc.text('  1 año de garantia en defecto de fabrica.', 27, 130)
    doc.text('• Este documento no es un comprobante', 27, 133)
    doc.text('  fiscal.', 27, 136)

    const qrCodeText = 'https://www.facebook.com/clicknet.mx'
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeText)
    doc.addImage(qrCodeDataUrl, 'PNG', 2, 116, 25, 25)

    doc.setFontSize(6);
    doc.setTextColor(120, 120, 120)

    const text = 'www.clicknetmx.com';
    const textWidth = doc.getTextWidth(text);
    const pagWidth = doc.internal.pageSize.width
    const x = (pagWidth - textWidth) / 2
    const y = 145
    doc.text(text, x, y)

    doc.save(`recibo_${formatId(recibos.id)}.pdf`)
  }

  return (

    <div className={styles.iconPDF}>
      <div onClick={generarPDF}>
        <BiSolidFilePdf />
      </div>
    </div>

  )
}
