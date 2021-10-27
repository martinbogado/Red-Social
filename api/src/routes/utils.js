const axios = require('axios');
const {User,Post,Comment,User_Comment,Comment_Post,Post_User} = require('../db.js');

const DB_UserID = async (username)=>{
	const UserID = await User.findOne({
			where:{
				username
			},
			include: [Post,Comment]
		})
	return UserID;
}

const DB_Allcomments = async (username)=>{
	user = await DB_UserID(username)
	const final = user.comments.map((comment)=>{
		return comment.dataValues;
	})
	return final;
}

const DB_Commentedit = async (id, content_data)=> {
	const updatedComment = await Comment.findOne({where: {'id':id}})
	updatedComment.content = content_data
	await updatedComment.save()
	return updatedComment;

}

const DB_Commentdestroy = async (id)=> {
	try{
		const eraseComment = await Comment.findOne({where: {'id':id}})
		await eraseComment.destroy()
		return 'Deleted Succesfully'
	}catch(e){
		throw new Error('We had a problem with your Delete')
	} 

}



const validateUpdateUser = (update, userID)=>{
	let obj = {}
	for(prop in update){

		if(userID[prop] || userID[prop] === null){
			if(prop == "name"){
				obj[prop] = update[prop]
			}
			if(prop == "lastname"){
				obj[prop] = update[prop]
			}
			if(prop == "password"){
				obj[prop] = update[prop]
			}
			if(prop == "image" ){
				obj[prop] = update[prop]
			}
			if(prop == "gitaccount"){
				obj[prop] = update[prop]
			}
			if(prop == "mail"){
				obj[prop] = update[prop]
			}
			if(prop == "username"){
				obj[prop] = update[prop]
			}
			//////////////// verificar lo de abajo
			if(prop == "Avatar"){
				obj[prop] = update[prop]
			}
			if(prop == "About"){
				obj[prop] = update[prop]
			}
			if(prop == "Tags"){
				obj[prop] = update[prop]
			}													
		}		
	}
	return obj
}

const DB_userCreates = async(date)=>{

//DESCOMENTAR LAS SIGUIENTES LINEAS SIII SE QUIERE VER LOS STATUS EN LA TERMINAL Y COMENTAR LA DE ABAJO
	if(typeof date == "object"){
		date.forEach(async e=>{
			await axios.post("http://localhost:3001/user/register",e).catch(e=>e)			
		})

//DESCOMENTAR LAS SIGUIENTES LINEAS NOOO SE QUIERE VER LOS STATUS EN LA TERMINAL Y COMENTAR LA DE ARRIBA
		// date.forEach(async e=>{
		// 	return await User.create(e)
		// })
	}
	
	return
}

module.exports = {
	DB_UserID,
	DB_Allcomments,
	DB_Commentedit,
	DB_Commentdestroy,
	validateUpdateUser,
	validateUpdateUser,
	DB_userCreates
}