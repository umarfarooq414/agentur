import {useState} from 'react'
import {useDispatch} from 'react-redux'
import {Link} from 'react-router-dom'
import {KTSVG} from '../../../../helpers'
import {deleteUser, UpdateUserStatus} from '../redux/usersAction'
const UserStatus = ({userId, status: propStatus}: {userId: string; status: string}) => {
  const [status, setStatus] = useState(propStatus)

  const dispatch = useDispatch()
  const handleStatusUpdate = async () => {
    // e.preventDefault()
    try {
      dispatch(UpdateUserStatus(userId, 'ACTIVE'))
    } catch (error) {}
  }

  return (
    <div>
      {/* <form onSubmit={handleStatusUpdate}> */}
      {propStatus == 'INACTIVE' && (
        <div
          className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
          onClick={() => handleStatusUpdate()}
        >
          <KTSVG
            path='/media/icons/duotune/arrows/arr012.svg'
            className='svg-icon-muted svg-icon-2hx'
          />
        </div>
      )}
      <div
        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
        onClick={() => dispatch(deleteUser(userId))}
      >
        <KTSVG path='/media/icons/duotune/general/gen027.svg' className='svg-icon-3' />
      </div>

      {/* <label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className='form-select form-select-solid'
          >
            <option value='ACTIVE'>Active</option>
            <option value='INACTIVE'>Inactive</option>
            <option value='DEACTIVATED'>Deactivated</option>
          </select>
        </label>
        <button className='btn btn-primary' type='submit'>
          Update
        </button> */}
      {/* </form> */}
    </div>
  )
}

export default UserStatus
