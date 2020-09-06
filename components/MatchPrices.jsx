import PriceTable from './MatchTable'

/**
 * [Component that displays matches parent component with last match price and child component "PriceTable"]
 *
 * @param   {[Object]}  props  [props]
 *
 * @return  {[Component]}       [return component]
 */
export default function Price(props) {
  const { price, matches } = props

  return (
    <div className='col-md-6 p-2'>
      <div className='card p-0 mt-2'>
        <div className='card-header'>
          <h2>Matches</h2>
          <h6 className='card-subtitle mb-2 text-muted'>
            Last match price: ${price}
          </h6>
        </div>
        <div className='card-body p-0'>
          <PriceTable matches={matches} />
        </div>
      </div>
    </div>
  )
}
