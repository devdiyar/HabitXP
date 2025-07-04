import type {ToastConfig} from 'react-native-toast-message';
import {BaseToast} from 'react-native-toast-message';
import React from 'react';

export const toastConfig: ToastConfig = {
    info: function (props) {
        return React.createElement(BaseToast, {
            ...props,
            style: {
                borderLeftColor: '#4f83cc',
                backgroundColor: '#2a2e35',
                borderRadius: 12,
                padding: 10,
            },
            contentContainerStyle: {paddingHorizontal: 15},
            text1Style: {
                fontSize: 16,
                fontWeight: 'bold',
                color: 'white',
            },
            text2Style: {
                fontSize: 14,
                color: '#ccc',
            },
            text1: `${props.text1}`,
        });
    },
};
