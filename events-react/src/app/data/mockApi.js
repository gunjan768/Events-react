import sampleData from './sampleData';

const delay = ms => 
{
    return new Promise(resolve => setTimeout(resolve, ms))
}

export const fetchSampleData = async () => 
{
    await delay(1000);
    
    return Promise.resolve(sampleData);
}