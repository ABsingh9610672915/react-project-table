import React from 'react'

const ReadTable = ({post , handleEditPostForm ,posts}) => {

  return (
    <>
         {
                posts.map((post)=>
              <tr key={post.id}>
                <td>{post.name}</td>
                <td>{post.id}</td>
                <td> <button type="button" 
                className="me-3 btn btn-primary ml-auto d-block mb-2" 
                data-bs-toggle="modal"
              data-bs-target="#editModalForm"
              onClick={(e)=>handleEditPostForm(e,post)}>
                Edit
             </button>
            </td>
           </tr>
                )}
      
    </>
  )
}

export default ReadTable
