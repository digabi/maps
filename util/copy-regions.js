const fs = require('fs')
const path = require('path')
const { allRanges, europeRanges, finlandSwedenRanges } = require('./regions')

const verbose = process.argv.includes('verbose')

const destinationArg = process.argv.find(arg => arg.split('=')[0] === 'destination')
const destinationValue = destinationArg && destinationArg.replace(/"/g, '').split('=')[1]
if (!destinationValue) {
  console.error('Missing destination argument')
  console.log('Add relative path to the destination where map files will be copied to')
  console.log('Example: node copy-regions destination="../maps/smallworld"')
  process.exit(1)
}

const destination = path.resolve(__dirname, destinationValue)
console.log('Files will be copied to:', destination, '\n')

// File ranges that will be copied
const ranges = [
  ...allRanges.filter(range => range.zoom < 8),
  europeRanges.find(range => range.zoom === 8),
  finlandSwedenRanges.find(range => range.zoom === 9)
]

console.log('Following ranges will be copied:')
console.log('-', ranges.map(range => range.name).join('\n- '), '\n')

const copy = async () => {
  const destinationFiles = await fs.promises.readdir(destination)
  if (destinationFiles.length > 0) {
    console.error('Error: Destination contains files! Please empty contents before copying')
    process.exit(1)
  }

  const startTime = Date.now()
  const mapRootPathFi = path.join(__dirname, '../maps/world/fi')
  const mapRootPathSv = path.join(__dirname, '../maps/world/sv')

  console.log('Copying finnish tiles')
  const destinationFi = path.join(destination, 'fi')
  await copyRanges(ranges, mapRootPathFi, destinationFi)

  console.log('Copying swedish tiles')
  const destinationSv = path.join(destination, 'sv')
  await copyRanges(ranges, mapRootPathSv, destinationSv)

  const totalTime = (Date.now() - startTime) / 1000
  console.log('Finished in ', totalTime, 's')
}

const copyRanges = async (ranges, mapRootPath, destinationPath) => {
  const copiedRanges = ranges.map(async range => {
    const rangePath = path.join(mapRootPath, String(range.zoom))
    return await copyRange(range, rangePath, destinationPath)
  })

  for await (const copiedRange of copiedRanges) {
    console.log('Files copied for range ', copiedRange.range.name)
  }
}

const copyRange = async (range, rangePath, destinationPath) => {
  const xDirectories = await fs.promises.readdir(rangePath)
  const xDirectoriesToCopy = xDirectories.map(async xDirectory => {
    if (Number(xDirectory) >= range.xMin && Number(xDirectory) <= range.xMax) {
      return {
        name: xDirectory,
        path: path.join(rangePath, xDirectory)
      }
    }
  })

  for await (const xDirectory of xDirectoriesToCopy) {
    if (!xDirectory) continue

    const xDirectoryDestination = path.join(destinationPath, String(range.zoom), xDirectory.name)
    await fs.promises.mkdir(xDirectoryDestination, { recursive: true })

    const yFiles = await fs.promises.readdir(xDirectory.path)
    const yFilesToCopy = yFiles.map(async yFile => {
      const y = Number(yFile.split('.')[0])
      if (y >= range.yMin && y <= range.yMax) {
        const yFilePath = path.join(xDirectory.path, yFile)
        const yFileDestination = path.join(xDirectoryDestination, yFile)

        if (verbose) console.log('Copying file', yFilePath, ' to', yFileDestination)
        await fs.promises.copyFile(yFilePath, yFileDestination)
      }
    })

    await Promise.all(yFilesToCopy)
  }

  return { range }
}

copy()
