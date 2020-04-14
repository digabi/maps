const fs = require('fs')
const path = require('path')

const verbose = process.argv.includes('verbose')

const europeRanges = [
  {
    name: 'Europe Zoom 6',
    zoom: 6,
    xMin: 26,
    xMax: 39,
    yMin: 13,
    yMax: 26
  },
  {
    name: 'Europe Zoom 7',
    zoom: 7,
    xMin: 54,
    xMax: 78,
    yMin: 27,
    yMax: 53
  },
  {
    name: 'Europe Zoom 8',
    zoom: 8,
    xMin: 110,
    xMax: 156,
    yMin: 54,
    yMax: 107
  },
  {
    name: 'Europe Zoom 9',
    zoom: 9,
    xMin: 221,
    xMax: 313,
    yMin: 109,
    yMax: 215
  }
]

const finlandSwedenRanges = [
  {
    name: 'Finland & Sweden Zoom 6',
    zoom: 6,
    xMin: 33,
    xMax: 37,
    yMin: 14,
    yMax: 20
  },
  {
    name: 'Finland & Sweden Zoom 7',
    zoom: 7,
    xMin: 67,
    xMax: 75,
    yMin: 28,
    yMax: 40
  },
  {
    name: 'Finland & Sweden Zoom 8',
    zoom: 8,
    xMin: 135,
    xMax: 150,
    yMin: 57,
    yMax: 80
  },
  {
    name: 'Finland & Sweden Zoom 9',
    zoom: 9,
    xMin: 270,
    xMax: 300,
    yMin: 114,
    yMax: 161
  }
]

const scan = async () => {
  const startTime = Date.now()
  const mapRootPathFi = path.join(__dirname, 'maps/world/fi')
  const mapRootPathSv = path.join(__dirname, 'maps/world/sv')


  console.log('//////////////////////////////////')
  console.log('Scanning Europe with finnish tiles')
  await scanRanges(europeRanges, mapRootPathFi)
  console.log('//////////////////////////////////')
  console.log('Scanning Europe with swedish tiles')
  await scanRanges(europeRanges, mapRootPathSv)
  console.log('//////////////////////////////////')
  console.log('Scanning Finland and Sweden with finnish tiles')
  await scanRanges(finlandSwedenRanges, mapRootPathFi)
  console.log('//////////////////////////////////')
  console.log('Scanning Finland and Sweden with swedish tiles')
  await scanRanges(finlandSwedenRanges, mapRootPathSv)
  console.log('//////////////////////////////////')
  const totalTime = (Date.now() - startTime) / 1000
  console.log('Finished in ', totalTime, 's')
}

const scanRanges = async (ranges, mapRootPath) => {
  const scannedRanges = ranges.map(async range => {
    const rangePath = path.join(mapRootPath, String(range.zoom))
    return await scanRange(range, rangePath)
  })

  for await (const scannedRange of scannedRanges) {
    console.log(scannedRange.range.name, ' size: ', scannedRange.scanStatistics.totalRangeSize)
    if (verbose) console.log(scannedRange.scanStatistics)
  }
}

const scanRange = async (range, rangePath) => {
  const scanStatistics = {
    totalRangeSize: 0,
    directoriesScanned: 0,
    directoriesSkipped: 0,
    filesScanned: 0,
    filesSkipped: 0,
    totalDirectories: 0,
    totalDirectoriesSkipped: 0,
    totalFiles: 0,
    totalFilesSkipped: 0
  }

  const xDirectories = await fs.promises.readdir(rangePath)
  scanStatistics.totalDirectories = xDirectories.length

  const xDirectoriesScanned = xDirectories.map(async xDirectory => {
    const xDirectoryPath = path.join(rangePath, xDirectory)
    const yFiles = await fs.promises.readdir(xDirectoryPath)
    scanStatistics.totalFiles += yFiles.length

    const x = Number(xDirectory)
    if (x >= range.xMin && x <= range.xMax) {
      scanStatistics.directoriesScanned++
      return {
        xDirectoryPath,
        yFiles
      }
    } else {
      scanStatistics.directoriesSkipped++
    }
  })

  for await (const xDirectoryScanned of xDirectoriesScanned) {
    if (!xDirectoryScanned) continue

    const yFilesScanned = xDirectoryScanned.yFiles.map(async yFile => {
      const yFilePath = path.join(xDirectoryScanned.xDirectoryPath, yFile)
      const stat = await fs.promises.stat(yFilePath)

      const y = Number(yFile.split('.')[0])
      if (y >= range.yMin && y <= range.yMax) {
        scanStatistics.filesScanned++
        scanStatistics.totalRangeSize += stat.size
      } else {
        scanStatistics.filesSkipped++
      }
    })

    await Promise.all(yFilesScanned)
  }

  scanStatistics.totalFilesSkipped = scanStatistics.totalFiles - scanStatistics.filesScanned
  scanStatistics.totalDirectoriesSkipped = scanStatistics.totalDirectories - scanStatistics.directoriesScanned

  return {
    range,
    scanStatistics
  }
}

scan()
