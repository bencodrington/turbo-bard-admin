import { error } from "@sveltejs/kit";
import ffmpeg from 'fluent-ffmpeg';
import pathToFfmpeg from 'ffmpeg-static';
import fs from 'node:fs';

export const actions = {
  // Default endpoint
  // Forms on this route's page are submitted to this rout by default
  default: async ({ request }) => {
    // Set the path to ffmpeg
    if (pathToFfmpeg === null) {
      return error(500, 'Unable to find FFMPEG locally.')
    }
    console.log('Setting ffmpeg path...')
    ffmpeg.setFfmpegPath(pathToFfmpeg);
    console.log('Successfully set ffmpeg path.')

    // Extract the file and file name from the submitted form data
    const formData = await request.formData();
    console.log(formData);
    const file = formData.get('startingFileLocation') as File;
    if (!file) {
      return error(500, 'Failed to receive file.');
    }
    const outputFileName = formData.get('outputFileName') as string;
    if (!outputFileName) {
      return error(500, 'Missing output file name.');
    }

    // Temporarily write the file to the static folder so that ffmpeg can read
    //  it from there.
    const tempFileLocation = `static/${outputFileName}`;
    fs.writeFileSync(tempFileLocation, Buffer.from(await file.arrayBuffer()));
    console.log('Saved input file to the static folder.');

    // Convert the file to .mp3 and .webm
    const formats = ['mp3', 'webm'];

    // These variables will be used to keep track of how many operations have
    //  been completed for each output format.
    const OPERATION_COUNT_PER_FORMAT = 2;
    let completedOperations: { [format: string]: number } = {};
    formats.forEach(format => {
      completedOperations[format] = 0;
    })
    const handleCompletedOperation = (format: string) => {
      console.log(`Completed operation for .${format} conversion.`);
      completedOperations[format] = completedOperations[format] + 1;
      const remainingFormats = formats.filter(format => completedOperations[format] < OPERATION_COUNT_PER_FORMAT);
      if (remainingFormats.length !== 0) {
        return;
      }
      console.log('All conversions completed.');
      fs.unlinkSync(tempFileLocation);
      console.log('Deleted temporary file.');
    }
    // Actually run the conversions
    formats.forEach((format) => {
      ffmpeg(tempFileLocation)
        .format(format)
        .save(`static/output/${outputFileName}.${format}`)
        .on('end', () => handleCompletedOperation(format))
        .on('error', (err) => {
          console.error(`Error converting to .${format}:`, err.message);
        })
        .run();
    })

  }
};