/**
 * [Component that displays global page's header]
 *
 * @return  {[Component]}       [return component]
 */ export default function Header() {
  return (
    <nav className='navbar navbar-expand-md navbar-dark fixed-top bg-dark'>
      <a className='navbar-brand' href='#'>
        Edgewater Markets
      </a>
      <button
        className='navbar-toggler'
        type='button'
        data-toggle='collapse'
        data-target='#navbarNav'
        aria-controls='navbarNav'
        aria-expanded='false'
        aria-label='Toggle navigation'
      >
        <span className='navbar-toggler-icon'></span>
      </button>
    </nav>
  )
}
