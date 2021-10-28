const { Router } = require("express");
const { Sequelize, Model } = require("sequelize");
const {User,Post} = require('../db.js');
const { DB_UserID,
    validateUpdatePost,
    DB_Postsearch, 
    DB_Postdestroy,
    DB_Postedit} = require("./utils.js");
const Op = Sequelize.Op;
const router = Router();

// const ruta = require("archivo")
// router.use("/", ruta)

// router.use("/", );

//Devuelve post de una categoria o si no todos los post
router.get("/", async (req, res) =>{
    const{categoria} = req.query;
    const allPosts = await Post.findAll({});
    if(categoria){
        let postCategoria = await allPost.filter(e => e.categoria.toLowerCase().includes(categoria.toLowerCase()));
        allPosts[0]? res.status(200).send(postCategoria) :
        res.status(404).send("There is no post with that tag");
    }else{
        res.status(200).send(allPosts);
    };
});

//Trae todos los posteos que hizo un usuario
router.get("/:username", async (req, res, next) =>{
    try{
        const {username} = req.params;
        if(!!Number(username)){
            return next()
        }
        const postName = await DB_Postsearch({'username':username})
        postName? res.send(postName) : res.send("This user has no Post");
    }catch(e){
        res.status(404).send("Error with the username");
    };
});

//Filtra por id
router.get("/:id", async (req, res, next) =>{
    try{
        const {id} = req.params;
        if(Number(id).toString() === 'NaN'){
            return next()
        }
        const postId = await DB_Postsearch({'id':id})
        postId? res.status(200).send(postId.dataValues) : res.send("No post with that id");
    }catch(e){
        res.status(404).send("Error with the id");
    };
});


router.post("/", async (req, res, next) =>{
    const{ 
        title,
        content,
        image,
        tags,
        likes,
        username
    } = req.body;
    try {
        let userDB = await DB_UserID(username);
        let createPost = await Post.create({
            image,
            likes,
            content,
            tags,
            title,
            'userId' : userDB.id
        });
        await userDB.addPost(createPost)
        res.send("Success in post creation");
    }catch(e){
        console.log(e)
        res.sendStatus(404)
    }
})


/*router.post("/register", async (req,res,next)=>{
	const {name,lastname,username, password,mail,gitaccount,image} = req.body;
	const user = await User.findOrCreate({
		where:{
			mail:mail
		},
		defaults:{
			name,
			lastname,
			username,
			password,
			mail,
			gitaccount,
			image
		}
	})
	res.status(200).send('Registro con exito');
})*/

//Eliminacion de un Post
router.delete("/:id", async (req, res) =>{
    try{
        const {id} = req.params;
        const deletePost = await DB_Postdestroy(id)
        res.status(200).send('Post eliminado con exito');
    }catch(e){
        res.status(404).send('Cant delete post');
    };   
});

//Edicion de post
router.put("/:id", async (req, res) =>{
    try{
        const {id} = req.params;
        const {title, content} = req.body
        console.log(title, content) 
        const updatePost = await DB_Postedit(id, title, content)
        res.status(200).send(updatePost);
    }catch(e){
        res.status(404).send('Cant apply changes')
    }
})



module.exports = router;