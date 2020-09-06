import styles from './PricesBATable.module.scss'

/**
 * [Component that displays table with bids/asks prices]
 *
 * @param   {[Object]}  props  [props]
 *
 * @return  {[Component]}       [return component]
 */
export default function PricesBATable(props) {
  const { prices } = props

  return (
    <div className='col-md-6 p-2'>
      <div className='card p-0 mt-2'>
        <div className='card-header'>
          <h2>Bids and Asks</h2>
        </div>
        <div className='card-body p-0'>
          <table className='table' className={styles.tableFixed}>
            <thead>
              <tr>
                <th scope='col'>Side</th>
                <th scope='col'>Size</th>
                <th scope='col'>Price</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((price, index) => (
                <tr key={index} className={styles[price[0]]}>
                  <td>{price[0]}</td>
                  <td>{price[2]}</td>
                  <td>${price[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
