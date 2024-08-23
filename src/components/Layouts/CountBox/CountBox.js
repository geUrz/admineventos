import { MoonLoader } from 'react-spinners'
import { size } from 'lodash'
import styles from './CountBox.module.css'
import { useEffect, useState } from 'react'

export function CountBox(props) {

  const {icon, count:{countAll}, title} = props

  return (
    
    <div className={styles.section}>
      <div className={styles.icon}>
        {icon}
      </div>
      <div className={styles.count}>
        {countAll === undefined || countAll === null ? (
          <h1>
            <MoonLoader
              color='cyan'
              size={25}
              speedMultiplier={.8}
            />
          </h1>
        ) : (
          countAll === 0 ? (
            <>
              <h1>0</h1>
              <h2>{title}</h2>
            </>
        ) : (
          <>
            <h1>{countAll}</h1>
            <h2>{title}</h2>
          </>
        ))}
      </div>
    </div>

  )
}
