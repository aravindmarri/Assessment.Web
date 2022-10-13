import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>GSS Assessment</title>
        <meta name="description" content="An Assessment app developed by GSS" />
        <link rel="icon" href="/favicon.ico" />
          <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
      </Head>
      <div className="h-10-vh exam-code-form">
                                <label  className="block mb-2 text-sm font-medium">Your Exam Code</label>
                                <input type="text" id="exam-code" name='exam-validation/'
                                       className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500
            focus:border-blue-500 block p-2.5 dark-bg dark:placeholder-gray-400
            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            title="Enter Code here..."
                                       required
                                       />
                                       <button className='w-32 light200-bg px-5 mt-6 p-2 font-medium text-sm rounded-full' onClick={startExam}>Start Exam</button>
             </div>
    </div>
  )
}

const startExam = () => {
  location.href = `exam-validation/${document.getElementsByTagName("input")[0].value}`;
}

export default Home
