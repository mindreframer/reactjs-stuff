# A 'thin' component... It acts like a component but is just a simple function

module.exports=
Footer= (props={})->
  (@footer props,
    (@p null, 
      (@small null, "Copyright by me, at this time.")
    )
  )