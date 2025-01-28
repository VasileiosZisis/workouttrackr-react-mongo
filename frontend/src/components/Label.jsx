const Label = ({ limit, handleLimitChange }) => {
  return (
    <label className='model__label'>
      per page:&emsp;
      <select
        className='model__select'
        value={limit}
        onChange={handleLimitChange}
      >
        <option value={12}>12</option>
        <option value={24}>24</option>
        <option value={48}>48</option>
      </select>
    </label>
  )
}

export default Label
