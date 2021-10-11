import React from 'react';
import { Image, ImageBackground } from 'react-native';

const imageSources = [
    require('@src/assets/random-images/Random_1.png'),
    require('@src/assets/random-images/Random_2.png'),
    require('@src/assets/random-images/Random_3.png'),
    require('@src/assets/random-images/Random_4.png'),
    require('@src/assets/random-images/Random_5.png'),
    require('@src/assets/random-images/Random_6.png'),
    require('@src/assets/random-images/Random_7.png'),
    require('@src/assets/random-images/Random_8.png'),
    require('@src/assets/random-images/Random_9.png'),
    require('@src/assets/random-images/Random_10.png'),
    require('@src/assets/random-images/Random_11.png'),
    require('@src/assets/random-images/Random_12.png'),
    require('@src/assets/random-images/Random_13.png'),
    require('@src/assets/random-images/Random_14.png'),
    require('@src/assets/random-images/Random_15.png'),
    require('@src/assets/random-images/Random_16.png'),
    require('@src/assets/random-images/Random_17.png'),
    require('@src/assets/random-images/Random_18.png'),
    require('@src/assets/random-images/Random_19.png'),
    require('@src/assets/random-images/Random_20.png'),
    require('@src/assets/random-images/Random_21.png'),
    require('@src/assets/random-images/Random_22.png'),
    require('@src/assets/random-images/Random_23.png'),
    require('@src/assets/random-images/Random_24.png'),
    require('@src/assets/random-images/Random_25.png'),
    require('@src/assets/random-images/Random_26.png'),
    require('@src/assets/random-images/Random_27.png'),
    require('@src/assets/random-images/Random_28.png'),
    require('@src/assets/random-images/Random_29.png'),  
]

const RandomImage = (props) => {
    const randomImageIndex = Math.floor(Math.random() * (29 - 0)); 
    const source = imageSources[randomImageIndex];

	return props.children 
        ? <ImageBackground source={source} resizeMode="cover" {...props}>{props.children}</ImageBackground> 
        : <Image source={source} {...props} />
};

export default RandomImage;
