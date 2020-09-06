/**
 * [Component that displays connection status with COINBASE websocket]
 *
 * @param   {[Object]}  props  [props]
 *
 * @return  {[Component]}       [return component]
 */
export default function Connection(props) {
  const { subscribed } = props
  if (subscribed) {
    return <span className='badge badge-success ml-1'>&nbsp;&nbsp;</span>
  } else {
    return <span className='badge badge-danger ml-1'>&nbsp;&nbsp;</span>
  }
}
