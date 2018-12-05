self.importScripts('../../../build/v3d.js');

self.onmessage = function(message) {

    var data = message.data;
    init(data.drawingSurface, data.width, data.height, data.pixelRatio);

};

var camera, scene, renderer, mesh, clock;

function init(offscreen, width, height, pixelRatio) {

    camera = new v3d.PerspectiveCamera(70, width / height, 1, 1000);
    camera.position.z = 400;

    scene = new v3d.Scene();

    clock = new v3d.Clock();

    // we don't use ImageLoader since it has a DOM dependency (HTML5 image element)

    var loader = new v3d.ImageBitmapLoader();

    loader.load('../../textures/crate.gif', function(imageBitmap) {

        var texture = new v3d.CanvasTexture(imageBitmap);
        var material = new v3d.MeshBasicMaterial({ map: texture });
        var geometry = new v3d.BoxBufferGeometry(200, 200, 200);
        mesh = new v3d.Mesh(geometry, material);
        scene.add(mesh);

        animate();

    }, null, function() {

        // Workaround for Firefox
        // https://bugzilla.mozilla.org/show_bug.cgi?id=1335594

        var material = new v3d.MeshBasicMaterial({ color: 0x00ff00 });
        var geometry = new v3d.BoxBufferGeometry(200, 200, 200);
        mesh = new v3d.Mesh(geometry, material);
        scene.add(mesh);

        animate();

    });

    renderer = new v3d.WebGLRenderer({ antialias: true, canvas: offscreen });
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);

}

function animate() {

    var delta = clock.getDelta();

    mesh.rotation.x += delta * 0.2;
    mesh.rotation.y += delta * 0.5;

    renderer.render(scene, camera);

    if (self.requestAnimationFrame) {

        self.requestAnimationFrame(animate);

    } else if (renderer.context.commit) {

        // Deprecated

        renderer.context.commit().then(animate);

    }

}