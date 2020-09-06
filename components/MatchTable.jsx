import moment from 'moment'
import styles from './MatchTable.module.scss'

/**
 * [Component that displays table with last matches for the selected currency/product]
 *
 * @param   {[Object]}  props  [props]
 *
 * @return  {[Component]}       [return component]
 */
export default function PriceTable(props) {
  const { matches } = props

  return (
    <table className='table' className={styles.tableFixed}>
      <thead>
        <tr>
          <th scope='col'>Product</th>
          <th scope='col'>Size</th>
          <th scope='col'>Price</th>
          <th scope='col'>Time</th>
        </tr>
      </thead>
      <tbody>
        {matches.map((match) => (
          <tr key={match.trade_id}>
            <td>{match.product_id}</td>
            <td>{match.size}</td>
            <td className={styles[match.side]}>${match.price}</td>
            <td>{moment(match.time).format('DD-MM-YYYY HH:mm:ss')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
