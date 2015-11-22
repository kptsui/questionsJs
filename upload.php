<?php

if ( !empty( $_FILES ) ) {

	$path=  $_FILES["file"]["name"];
    $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
	$extension = ".".end(explode('.', $_FILES['file']['name']));
	$filename= basename($path, $extension);
	$uploadPath = 'uploads' . DIRECTORY_SEPARATOR . $filename . $extension;
	
	$counter = 0;
	while (file_exists($uploadPath))
	{
		$counter++;
		$uploadPath = 'uploads' . DIRECTORY_SEPARATOR . $filename . $counter . $extension;
	}
	
    move_uploaded_file( $tempPath, dirname( __FILE__ ) . DIRECTORY_SEPARATOR . $uploadPath );

    $answer = array( 'answer' => 'File transfer completed' );
    $json = json_encode( $answer );

    echo $json;

} else {

    echo 'No files';

}

?>