import React, { ReactNode, useEffect, useState } from 'react'
import './App.css'
import classNames from 'classnames'
import Loader from './assets/Loader'
import PieChart from './Charts/PieChart'
import LineChart from './Charts/LineChart'
import BarChart from './Charts/BarChart'


interface IData  {
   columns : Array<string>,
   data : Array<[]>,
   vizz : string,
} 



function App() {
  // file convertor
  const toBase64 = (file: any) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
  

  // states
  const [query, setQuery] = useState<string>('Разбивка кредита по валюте')
  const [choiseType, setChoiseType] = useState<string>('table')
  const [chartData, setChartData] = useState<IData>()
  const [uploadData, setUploadData] = useState<unknown[] | undefined>()
  const charts_name = [ 'table', 'pie', 'line', 'bar' ]
  const [loading, setLoading] = useState<boolean>(false)
  const [list, setList] = useState<string[]>()

  // rotate matrix in 90deg and return new array and show data in tabel or pie , bar, line chats 
  const rotateMatrix = (data:unknown) => {

    const newArr: unknown = Array(data?.data[0].length + 1).fill().map(() => Array(data?.columns.length).fill());
    console.log(data?.data[0].length)
  
    for (let i = 0; i < data?.columns.length; i++) {
      for (let j = 0; j < data?.data[0].length; j++) {
         newArr[j+ 1][i] = data?.data[i][j];
      }
    }
    for (let index = 0; index < data?.columns.length; index++) {
        newArr[0][index] = data?.columns[index]
    }
    console.log(newArr)
    return newArr
  }
  // requst for get list of dataBase
  useEffect(() => {
      fetch('http://185.250.204.162:5055/getTables', {
        method : 'GET',
        headers : {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(res => {
        setList(res)
      })
  },[]) 
  // requst for get data and send in rotateMatrix
  const load_query = (event: { preventDefault: () => void }) => {
    setLoading(true)
    event?.preventDefault()
    fetch('http://185.250.204.162:5055/',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query : query,
        vizz : choiseType,

      })
    })
    .then(res => res.json())
    .then(data => {
      setChartData(data)
      setUploadData(rotateMatrix(data))
      console.log(uploadData)
    })
    .catch(e => {
      console.log(e)
    })
    .finally(() => {
      console.log('all')
      setLoading(false)
    })
  }
 
  const handleAddDataBase = (e: any) => {
    toBase64(e.target.files[0])
    .then((base64: unknown) => {
       fetch('http://185.250.204.162:5055/addTable',{
          method : 'POST',
          headers : {
            'Content-Type': 'application/json'
          },
          body : JSON.stringify({
            file_data : base64.split(',')[1],
            table_name: 'another_file' 
          })
       })
       .then(res => res.json())
       .then(res => {
        console.log(res)
       })
    })
  }

  return (
    <div className='root'>
      <div className='list_container'>
        <label className='upload'>
          <h1>Загрузить файл...</h1>
          <input className='input_upload' onChange={handleAddDataBase} draggable type="file" />
        </label>
        <h1 className='title_list'>Список баз данных</h1>
         {list?.map((item: string) => 
          <h2 className='item_list'>{item}</h2>
        )}
      </div>
      <div>
        <form className='qery_block'>
          <input 
            className='input_field' 
            value={query} 
            onChange={(e:React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)} 
            type="text" 
            placeholder='Введите ваш запрос' 
          />
          <button type='submit' onClick={load_query} className='btn_field'>Запустить</button>
        </form>
        <ol className='chart_type_wraper'>
         {charts_name.map((item, index) => 
          <li 
            className={classNames(item === choiseType && 'active')} 
            key={index} 
            onClick={() => setChoiseType(item)} 
          >
            {item}
          </li>
         )}
        </ol>
        {loading  ?
            <Loader/>
          :
         <div className='dasboard_block'>
            <div className='dashboard_wrap'>
              {choiseType === 'table' &&
                <>
                  <div className='table'>
                    {uploadData?.map((item, index) =>
                      <div className={'table_row ' + (index === 0 ? 'table_header ' : '') + (index % 2 === 0 ? 'table_row_even' : 'table_row_odd')}>
                        {item.map((content:any) =>
                          <div className='table_element'>
                            {content}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              }
              { choiseType === 'pie' && 
                <PieChart chartData={
                  chartData != null ? 
                    chartData.data : 
                    [[], []]
                } /> 
              }
              { choiseType === 'line' && 
                <LineChart chartData={
                  chartData != null ? 
                    chartData.data : 
                    [[], []]
                } /> 
              }
              { choiseType === 'bar' && 
                <BarChart chartData={
                  chartData != null ? 
                    chartData.data : 
                    [[], []]
                } /> 
              }
            </div>
         </div>
        }
      </div>
    </div>
  )
}

export default App
