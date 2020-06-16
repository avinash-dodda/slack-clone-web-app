import React from 'react';
import Spinner from 'react-bootstrap/Spinner'

class LoadingSpinner extends React.Component {


    render() {
        const { position="fixed"} = this.props
        return (

            <Spinner 
                style={{
                    position: position,
                    top: "50%",
                    right: "50%"
                }}
                as="span"
                animation="border"
                size="lg"
                role="status"
                aria-hidden="true"
                variant="primary"
            />
        )
    }


}



export default LoadingSpinner;