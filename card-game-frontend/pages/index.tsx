import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Game from '../components/Game'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Game />
    </div>
  )
}

export default Home
