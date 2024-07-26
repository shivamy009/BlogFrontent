import toast from "react-hot-toast";

const uploadImage=async(image)=>{

    let imageUrl=null
    const data=new FormData();
    data.append("file",image)
    data.append("upload_preset",import.meta.env.VITE_UPLOAD_PRESET)
    data.append("cloud_name",import.meta.env.VITE_CLOUD_NAME);

    try{
        if(image===null){
            return toast.error("Please upload Image")
        }
        let loadingToast=toast.loading("Uploading...")

        const res=await fetch(import.meta.env.VITE_CLOUDINARY_URL,{
            method:'POST',
            body:data
        })
        const cloudData=await res.json();
        toast.dismiss(loadingToast)
        // console.log(cloudData.url);
        imageUrl=cloudData.url
       return imageUrl
    }catch(err){
       console.log(err)
    }
}

export default uploadImage