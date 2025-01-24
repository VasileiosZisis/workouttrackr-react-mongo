import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import './Pagination.css'

const Pagination = ({ totalPages, initialPage = 1, onPageChange }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const searchParams = new URLSearchParams(location.search)
  const currentPage = Number(searchParams.get('page')) || initialPage

  const handlePageClick = selectedItem => {
    const newPage = selectedItem.selected + 1
    searchParams.set('page', newPage)
    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace: true
    })

    if (onPageChange) {
      onPageChange(newPage)
    }
  }

  useEffect(() => {
    if (currentPage > totalPages) {
      searchParams.set('page', totalPages || 1)
      navigate(`${location.pathname}?${searchParams.toString()}`, {
        replace: true
      })
    }
  }, [currentPage, totalPages, navigate, searchParams, location.pathname])

  return (
    <ReactPaginate
      previousLabel={'<'}
      nextLabel={'>'}
      breakLabel={'...'}
      pageCount={totalPages}
      forcePage={currentPage - 1}
      marginPagesDisplayed={1}
      pageRangeDisplayed={9}
      onPageChange={handlePageClick}
      containerClassName={'pagination'}
      pageClassName={'pagination__page'}
      activeClassName={'pagination__active'}
      previousClassName={'pagination__prev'}
      nextClassName={'pagination__next'}
      disabledClassName={'pagination__disabled'}
    />
  )
}

export default Pagination
