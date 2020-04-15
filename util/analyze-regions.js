const fs = require('fs')
const path = require('path')
const { allRanges, europeRanges, finlandSwedenRanges } = require('./regions')

const verbose = process.argv.includes('verbose')
const includeAllRanges = process.argv.includes('all')

const scan = async () => {
  const startTime = Date.now()
  const mapRootPathFi = path.join(__dirname, '../maps/world/fi')
  const mapRootPathSv = path.join(__dirname, '../maps/world/sv')

  if (includeAllRanges) {
    console.log('//////////////////////////////////')
    console.log('Scanning world with finnish tiles')
    await scanRanges(allRanges, mapRootPathFi)
    console.log('//////////////////////////////////')
    console.log('Scanning world with swedish tiles')
    await scanRanges(allRanges, mapRootPathSv)
  }

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
