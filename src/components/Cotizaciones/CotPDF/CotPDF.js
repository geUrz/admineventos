import { BiSolidFilePdf } from 'react-icons/bi'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import QRCode from 'qrcode'
import { formatCurrency, formatDate, formatId } from '@/helpers'
import styles from './CotPDF.module.css'

export function CotPDF(props) {

  const {cliente, cotizaciones, conceptos, cotizacionNota} = props
    
  const generarPDF = async () => {

    if (!cotizaciones) return

    const toggleIVA = JSON.parse(localStorage.getItem('ontoggleIVA') || 'true');

    const doc = new jsPDF(
      {
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      }
    )

    const logoImg = 'img/logo.png'
    const logoWidth = 50
    const logoHeight = 14
    const marginRightLogo = 15

    const pageWidth = doc.internal.pageSize.getWidth()

    const xPosition = pageWidth - logoWidth - marginRightLogo

doc.addImage(logoImg, 'PNG', xPosition, 30, logoWidth, logoHeight)

    doc.setFont('helvetica')

    const marginRight = 15
    const font1 = 12
    const font2 = 10
    const font3 = 9

    doc.setFontSize(`${font1}`)
    doc.setTextColor(0, 0, 0)
    doc.text('CLICKNET', 15, 28)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text('Punta Este Corporativo', 15, 32)
    doc.text('Calzada Carranza 951', 15, 36)
    doc.text('Piso 10 Suite 304, Interior "E"', 15, 40)
    doc.text('C.P. 2125', 15, 44)
    doc.setFontSize(`${font3}`)
    doc.setTextColor(0, 0, 0)
    doc.text('Juan Roberto Espinoza Espinoza', 15, 48)
    doc.setFontSize(`${font3}`)
    doc.setTextColor(120, 120, 120)
    doc.text('RFC: EIEJ8906244J3', 15, 52)

    doc.setFontSize(`${font2}`)
    doc.setTextColor(0, 0, 0)
    doc.text('Cliente', 15, 70)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text(`${cotizaciones.cliente}`, 15, 74)

    doc.setFontSize(`${font2}`)
    doc.setTextColor(0, 0, 0)
    doc.text('COTIZACIÓN', doc.internal.pageSize.width - marginRight - doc.getTextWidth('COTIZACIÓN'), 64)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(0, 0, 0)
    doc.text('Folio', doc.internal.pageSize.width - marginRight - doc.getTextWidth('Folio'), 70)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text(`${formatId(cotizaciones.id)}`, doc.internal.pageSize.width - marginRight - doc.getTextWidth(`${formatId(cotizaciones.id)}`), 74)

    doc.setFontSize(`${font2}`)
    doc.setTextColor(0, 0, 0)
    doc.text('Contacto', 15, 80)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text(`${cliente.contacto}`, 15, 84)

    doc.setFontSize(`${font2}`)
    doc.setTextColor(0, 0, 0)
    doc.text('Fecha/Hora', doc.internal.pageSize.width - marginRight - doc.getTextWidth('Fecha/Hora'), 80)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text(
      `${formatDate(cotizaciones.createdAt)}`,
      doc.internal.pageSize.width - 13.9 - doc.getTextWidth(`${formatDate(cotizaciones.createdAt)}`),
      84
    )

    doc.autoTable({
      startY: 94,
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
        cellPadding: 1.5,
        cellWidth: 'auto',
      },
      body: conceptos.map(concepto => [
        { content: `${concepto.tipo}`, styles: { halign: 'center' } }, 
        { content: `${concepto.concepto}`, styles: { halign: 'left' } }, 
        { content: `$${formatCurrency(concepto.precio)}`, styles: { halign: 'right' } },  
        { content: `${concepto.cantidad}`, styles: { halign: 'center' } },  
        { content: `$${formatCurrency(concepto.precio * concepto.cantidad)}`, styles: { halign: 'right' } },  
        ]),
      headStyles: { 
        fillColor: [255, 255, 255], 
        fontSize: `${font3}`,
        fontStyle: 'bold', 
        textColor: [0, 0, 0], 
        lineWidth: { bottom: 0.5 }, 
        lineColor: { bottom: [224, 114, 45] } 
      },
      bodyStyles: { fontSize: `${font3}` },
      columnStyles: {
        0: { cellWidth: 20 },  
        1: { cellWidth: 95 },  
        2: { cellWidth: 25 }, 
        3: { cellWidth: 15 },  
        4: { cellWidth: 25 },  

        cellPadding: 1.5,      
        valign: 'middle'    
    },

      margin: { top: 0, left: 15, bottom: 0, right: 15 },

    })

    const calcularTotales = () => {
      const subtotal = conceptos.reduce((acc, curr) => acc + curr.cantidad * curr.precio, 0)
      const iva = subtotal * 0.16
      const total = toggleIVA ? subtotal + iva : subtotal
      return { subtotal, iva, total };
    };
  
    const { subtotal, iva, total } = calcularTotales()

    doc.setFontSize(`${font2}`)
    doc.setTextColor(0, 0, 0)
    doc.text('Nota:', 15, 234)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text(`${
      (cotizacionNota) === undefined ? (
        cotizaciones.nota
      ) : (
        cotizacionNota
      )
    }`, 15, 238)

    const verticalData = [
      ...toggleIVA ? [
        ['Subtotal:', `$${formatCurrency(subtotal)}`],
        ['IVA:', `$${formatCurrency(iva)}`],
      ] : [],
      ['Total:', `$${formatCurrency(total)}`]
    ];
    
    const pWidth = doc.internal.pageSize.getWidth()
    const mRight = 15
    const tableWidth = 44
    const marginLeft = pWidth - mRight - tableWidth

    doc.autoTable({
      startY: 230,
      margin: { left: marginLeft, bottom: 0, right: marginRight },
      body: verticalData,
      styles: {
        cellPadding: 1,
        valign: 'middle',
        fontSize: `${font2}`,
      },
      columnStyles: {
        0: { cellWidth: 20, fontStyle: 'bold', halign: 'right' },
        1: { cellWidth: 24, halign: 'right' }  
      }
    })


    doc.setFontSize(`${font2}`)
    doc.setTextColor(0, 0, 0)
    doc.text('• Pago en pesos.', 50, 255)
    doc.text('• Se requiere el 50% de anticipo para dar inicio al proyecto.', 50, 260)
    doc.text('• Todos nuestros equipos cuenta con 1 año de garantia', 50, 265)
    doc.text('  por defecto de fabrica.', 50, 269)
    doc.text('• Esta cotización tiene una vigencia de 15 dias.', 50, 274)


    const qrCodeText = 'https://www.facebook.com/clicknet.mx'
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeText)
    doc.addImage(qrCodeDataUrl, 'PNG', 10, 245, 40, 40)

    doc.save(`cotización_${formatId(cotizaciones.id)}.pdf`)
  }

  return (
    
    <div className={styles.iconPDF}>
      <div onClick={generarPDF}>
        <BiSolidFilePdf />
      </div>
    </div>

  )
}
