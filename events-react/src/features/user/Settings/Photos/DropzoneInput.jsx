import React, { useCallback } from 'react'
import {useDropzone} from 'react-dropzone'
import { Icon, Header } from 'semantic-ui-react'

const DropzoneInput = ({ setFiles }) => 
{
    const onDrop = useCallback(acceptedFiles => 
    {
        // console.log("AcceptedFiles : ",acceptedFiles);
        
        setFiles(acceptedFiles.map(file =>
        {
            // If you print file.preview you will get undefined though there is a preview prop attached to a file but we need to
            // transform it to the DOMString.
            // console.log(URL.createObjectURL(file));

            // Object.assign() will create object in memory and will remain in memory until we will remove it by ourself. It is used
            // to generate the preview image which we can use to display it in the preview section. Object.assign() accepts two
            // or more parameters where first one is the target object and others are sources objects. All sources are get copied
            // to the target object. Target object may or may not be empty.
            return Object.assign(file,
            {
                // DOMString is a UTF-16 String. As JavaScript already uses such strings, DOMString is mapped directly to a String.
                // The URL.createObjectURL() static method creates a DOMString containing a URL representing the object given in 
                // the parameter. To release an object URL, call revokeObjectURL() in useEffect.
                preview: URL.createObjectURL(file)
            })
        }))

    }, [setFiles])

    const { getRootProps, getInputProps, isDragActive } = useDropzone(
    {
        onDrop,
        multiple: false,
        accept: 'image/*'
    })

    return (
        <div { ...getRootProps() } className = { 'dropzone ' + ( isDragActive && 'dropzone--isActive' ) }>
            <input { ...getInputProps() } />
            <Icon name='upload' size='huge' />
            <Header content='Drop image here' />
        </div>
    );
}

export default DropzoneInput;