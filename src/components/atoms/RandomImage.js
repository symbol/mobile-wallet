import React from 'react';
import { Image, ImageBackground } from 'react-native';

const imageSources = [
    require('@src/assets/random-images/Random_21.png'),
    require('@src/assets/random-images/Random_22.png'),
    require('@src/assets/random-images/Random_23.png'),
    require('@src/assets/random-images/Random_24.png'),
    require('@src/assets/random-images/Random_25.png'),
    require('@src/assets/random-images/Random_26.png'),
    require('@src/assets/random-images/Random_27.png'),
    require('@src/assets/random-images/Random_28.png'),
    require('@src/assets/random-images/Random_29.png'),
    require('@src/assets/random-images/Random_30.png'),  
]

const RandomImage = (props) => {
    const randomImageIndex = Math.floor(Math.random() * (30 - 21)); 
    const source = imageSources[randomImageIndex];

	return props.children 
        ? <ImageBackground source={source} resizeMode="cover" {...props}>{props.children}</ImageBackground> 
        : <Image source={source} {...props} />
};

export default RandomImage;
