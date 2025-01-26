import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import './Pagination.css'

const Pagination = ({
  totalPages,
  initialPage = 1,
  onPageChange,
  totalWlPages,
  totalPaPages
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  const searchParams = new URLSearchParams(location.search)
  const currentPage = Number(searchParams.get('page')) || initialPage

  const handlePageClick = e => {
    const newPage = e.selected + 1
    searchParams.set('page', newPage)
    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace: true
    })

    if (onPageChange) {
      onPageChange(newPage)
    }
  }

  useEffect(() => {
    if (totalPaPages) {
      if (currentPage > totalPages) {
        searchParams.set('page', totalPages || 1)
        navigate(`${location.pathname}?${searchParams.toString()}`, {
          replace: true
        })
      }
    } else if (totalWlPages) {
      if (currentPage > totalWlPages) {
        searchParams.set('page', totalWlPages || 1)
        navigate(`${location.pathname}?${searchParams.toString()}`, {
          replace: true
        })
      }
    } else if (totalPaPages) {
      if (currentPage > totalPaPages) {
        searchParams.set('page', totalPaPages || 1)
        navigate(`${location.pathname}?${searchParams.toString()}`, {
          replace: true
        })
      }
    }
  }, [
    currentPage,
    totalPages,
    totalWlPages,
    totalPaPages,
    navigate,
    searchParams,
    location.pathname
  ])

  return (
    <ReactPaginate
      previousLabel={'<'}
      nextLabel={'>'}
      breakLabel={'...'}
      pageCount={totalPages || totalWlPages || totalPaPages}
      forcePage={currentPage - 1}
      marginPagesDisplayed={1}
      pageRangeDisplayed={9}
      onPageChange={handlePageClick}
      renderOnZeroPageCount={null}
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
