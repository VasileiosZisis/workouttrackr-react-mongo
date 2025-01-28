import { Oval } from 'react-loader-spinner'

const Loader = () => {
  return (
    <div
      style={{ display: 'grid', placeContent: 'center', marginBlock: '2rem' }}
    >
      <Oval
        visible={true}
        height='150'
        width='150'
        color='#f2f2f2'
        secondaryColor='#bbbbbb'
        ariaLabel='oval-loading'
        wrapperStyle={{ display: 'block', margin: 'auto' }}
        wrapperClass=''
      />
    </div>
  )
}

export default Loader
