// import path from 'path';

function getImagePath(abjCode, assetName) {
    // Assuming the assets are located in the 'assets' directory
    console.log("abjCode:", abjCode);
    console.log("assetName:", assetName);
    console.log("current dir:", __dirname);
    var imgRoot = "@base/assets/images";
    // var imgRoot = path.join(__dirname, 'images');
    // if (imgRoot.includes(abjCode)) {
    imgRoot = `${imgRoot}/${abjCode}`;
    // }

    // const assetPath = path.join(imgRoot, assetName);
    const assetPath = `${imgRoot}/${assetName}`;

    // return assetPath;
    return require('@/assets/images/add/img_wired_add_03.svg')
}

const Assets = {
    getImagePath
};

export default Assets;