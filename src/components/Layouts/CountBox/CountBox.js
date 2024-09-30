import { MoonLoader } from 'react-spinners'
import { size } from 'lodash'
import styles from './CountBox.module.css'
import { useEffect, useState } from 'react'

export function CountBox(props) {

  const {icon, count:{countAll}, title} = props

  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 800) 

    return () => clearTimeout(timer)
  }, [])

  return (
    
    <div className={styles.section}>
      <div className={styles.icon}>
        {icon}
      </div>
      <div className={styles.count}>
        {showLoading ? (
          <h1>
            <MoonLoader
              color='white'
              size={24.5}
              speedMultiplier={.8}
            />
          </h1>
        ) : (
          countAll === 0 ? (
            <>
              <h1>0</h1>
            </>
        ) : (
          <>
            <h1>{countAll}</h1>
          </>
        ))}
        <h2>{title}</h2>
      </div>
    </div>

  )
}
