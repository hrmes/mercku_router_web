// import path from 'path';
import store from '@/store/index';

function getImagePath(id, ab, j = 0) {
    // Assuming the assets are located in the 'assets' directory
    console.log("abCode:", ab);
    console.log("jCode:", j);
    console.log("id:", id);
    // console.log("assetName:", assetName);
    // console.log("current dir:", __dirname);
    const imgMap = process.env.CUSTOMER_CONFIG.images;
    const imgRoot = require.context('./images', true, /\.(png|jpe?g|svg)$/);
    console.log("imgRoot:", imgRoot);
    // const imgRoot = "@/assets/images";
    const relPath = imgMap[id];
    console.log("relPath:", relPath);
    const abjPath = `./${ab}/${j}/${relPath}`;
    try {
        console.log("getImagePath abjPath:", abjPath);
        return imgRoot(abjPath);
    } catch (e) {
        if (j !== 0) {
            const abPath = `./${ab}/0/${relPath}`;
            try {
                console.log("getImagePath abPath:", abPath);
                return imgRoot(abPath);
            } catch (e) {
                console.log("getImagePath relPath:", relPath);
                return imgRoot(`./${relPath}`);
            }
        }
        else {
            console.log("getImagePath relPath:", relPath);
            return imgRoot(`./${relPath}`);
        }
    }
}

function getDeviceMeta() {
    const modelAb = store.state.profile?.model_ab || '08';
    const modelJ = store.state.profile?.model_j || '0';
    return getDeviceMetaOf(modelAb, modelJ);
}

function getDeviceMetaOf(modelAb, modelJ) {
    const map = process.env.CUSTOMER_CONFIG.deviceMeta;
    const dftMeta = map.dft || {
        name: "Router",
        shortName: "Router",
        deviceColors: ["black"],
    };
    const abMeta = map[modelAb];
    if (abMeta) {
        const jMeta = abMeta[modelJ] || dftMeta;
        return jMeta;
    }
    else {
        return dft;
    }
}

const Assets = {
    getImagePath,
    getDeviceMeta,
    getDeviceMetaOf,
};

export default Assets;