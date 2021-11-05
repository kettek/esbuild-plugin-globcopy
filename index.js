const chokidar = require('chokidar')
const glob = require('tiny-glob')
const match = require('minimatch')
const fs = require('fs-extra')
const path = require('path')

function globCopyPlugin({
    targets=[],
    outdir='',
    srcdir='./',
}) {
    const plugin = {
        name: "esbuild-plugin-globcopy",
        async setup(build) {
            if (!Array.isArray(targets)) {
                targets = [targets]
            }
            if (outdir === '' && build.initialOptions.outdir === '') {
                throw new Error('outdir must be specified in globcopy or by esbuild')
            }
            outdir = outdir || build.initialOptions.outdir

            const copyFile = async f => {
                let inpath = path.join(srcdir, f)
                let outpath = path.join(outdir, f)
                console.log('copy:', inpath, '=>', outpath)
                return await fs.copy(inpath, outpath)
            }
            const removeFile = async f => {
                let outpath = path.join(outdir, f)
                console.log('remove:', outpath)
                await fs.remove(outpath)
            }

            if (build.initialOptions.watch) {
                const watcher = chokidar.watch(targets, {
                    cwd: srcdir,
                })
                watcher.on('add', async p => {
                    if (!targets.some(g => match(p, g))) return
                    await copyFile(p)
                })
                .on('change', async p => {
                    if (!targets.some(g => match(p, g))) return
                    await copyFile(p)
                })
                .on('unlink', async p => {
                    if (!targets.some(g => match(p, g))) return
                    await removeFile(p)
                })
            } else {
                build.onStart(async () => {
                    const files = (
                        await Promise.all(targets.map(t=>glob(t, {cwd: srcdir})))
                    ).flat()
                    for (let f of files) {
                        await copyFile(f)
                    }
                })
            }
        },
    }
    return plugin
}

module.exports = globCopyPlugin