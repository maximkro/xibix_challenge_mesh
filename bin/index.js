const mesh = require('./mesh10000.json');


const calculatePeaks = (blocks, mesh) => {
    let peaks = [];
    const { values } = mesh;
    for (let block of blocks) {
        let peak = block.map(m => mesh.values[m]).reduce((a, b) => { return a.value > b.value ? a: b}, 0);
        if(!peaks.includes(peak)) {
            peaks.push(peak);
        }
    }
    return peaks;
};
const getNeighbours = (root, mesh, blocks) => {
    let neighbors = [];
    for (let i = root.id; i < root.id + 4; i++) {
        if (!mesh.elements[i].nodes.some(el => root.nodes.includes(el))) {
            break;
        }
        neighbors.push(mesh.elements[i].id);
    }
    let nextRight = mesh.elements.find(el => el.nodes[0] === root.nodes[2]);
    if (nextRight) {
        for (let i = nextRight.id + 1; i > nextRight.id - 4; i--) {
            if (mesh.elements[i].nodes.some(n => root.nodes.includes(n))) {
                neighbors.push(mesh.elements[i].id);
            }
        }
    }

    if (!blocks) {
        blocks.push(neighbors);
    }
    else {
        for (let block of blocks) {
            for (let el of block) {
                if (!neighbors.includes(el) && mesh.elements[el].nodes.some(n => root.nodes.includes(n))) {
                    neighbors.push(el);
                }
            }
        }
        blocks.push(neighbors);
    }
    
    return blocks;
};
const getPeaks = (mesh, n) => {
    let blocks = [];
    let root = mesh.elements[0];
    let foundPeaks = false;
    let peaks = [];
    while (!foundPeaks) {
        blocks = getNeighbours(root, mesh, blocks);
        
        root = mesh.elements[root.id++];
        if (blocks.length >= n) {
            peaks = calculatePeaks(blocks, mesh);
            if (peaks.length === n) {
                foundPeaks = true;
            }
        }
    }
    return peaks;
};
const peaks = getPeaks(mesh, 1500)
console.log(peaks);
