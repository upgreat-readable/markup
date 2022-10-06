import React from 'react';
import { markupStoresContext } from 'pages/MarkupService/context';

export const useMarkupStore = () => React.useContext(markupStoresContext);
