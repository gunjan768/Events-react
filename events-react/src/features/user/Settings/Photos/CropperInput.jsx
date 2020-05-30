import React, { Component } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css'; // see installation section above for versions of NPM older than 3.0.0
// If you choose not to use import, you need to assign Cropper to default
// var Cropper = require('react-cropper').default


class CropperInput extends Component 
{
    cropper = React.createRef();

    cropImage = () => 
    {
        const { setImage } = this.props;

        if(typeof this.cropper.current.getCroppedCanvas() === 'undefined') 
        return;
        
        // Whne yoA Binary Large OBject (BLOB) is a collection of binary data stored as a single entity in a database management 
        // system. Blobs are typically images, audio or other multimedia objects, though sometimes binary executable code is stored 
        // as a blob. Firebase storage function uploadFile() accepts a file as a blob.
        this.cropper.current.getCroppedCanvas().toBlob(blob => 
        {
            // console.log("Blob : ",blob);

            setImage(blob);

        }, 'image/jpeg');
    }
    

    render() 
    {
        const { imagePreview } = this.props;

        return (
            <Cropper
                ref = { this.cropper }
                src = { imagePreview }
                style = {{ height: 200, width: '100%' }}

                // preview will let you preivew the image while cropping. In preview put any name and before that name if there is '#' means
                // it signifies the id or if '.' then it signifies the class. 
                preview='#img-preview'

                // Cropper.js options
                aspectRatio = { 1 }
                viewMode = { 1 }
                dragMode='move'
                guides
                scalable
                cropBoxMovable
                cropBoxResizable
                crop = { this.cropImage } 
            />
        );
    }
}

export default CropperInput; 