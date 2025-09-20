import React from 'react'
import Layout from '../../components/layout/Layout'
import { Link } from 'react-router-dom'
const Billdetails = () => {
  return (
    <div>
      <Layout>
            <Link to={'/dashboard/manager/addbills'}>
            add bill
            </Link>
      </Layout>
    </div>
  )
}

export default Billdetails
