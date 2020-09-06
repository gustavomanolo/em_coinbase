/**
 * [Component that displays connection status with the server]
 *
 * @param   {[Object]}  props  [props]
 *
 * @return  {[Component]}       [return component]
 */
export default function Connection(props) {
  const { connected } = props
  if (connected) {
    return (
      <div className='row'>
        <div className='alert alert-success col-md-12' role='alert'>
          Online
        </div>
      </div>
    )
  } else {
    return (
      <div className='row'>
        <div className='alert alert-danger col-md-12' role='alert'>
          Offline - Check for network connection
        </div>
      </div>
    )
  }
}
