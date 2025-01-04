using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Mvc;

namespace GameSet.Controllers;


[ApiController]
[Route("[controller]")]

public class AwsController : Controller
{
    private static HttpClient _httpClient = new HttpClient();

    [HttpGet("GetS3PresignedUrl")]
    public async Task<Dictionary<string, string>> GetS3PresignedUrlAsync(string keyName)
    {
        string bucketName = "ecspipelinegithub-httpsfargateapplicationloadbalan-ops7ugpglzg7";

        double timeoutDuration = 12; // Duration in hours

        AWSConfigsS3.UseSignatureVersion4 = true;
        IAmazonS3 client = new AmazonS3Client(RegionEndpoint.USEast1);

        string url = await GeneratePreSignedURL(client, bucketName, keyName, timeoutDuration);
        return new Dictionary<string, string> { { "url", url } };
    }
    private static Task<string> GeneratePreSignedURL(
            IAmazonS3 client,
            string bucketName,
            string objectKey,
            double duration)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = bucketName,
            Key = objectKey,
            Verb = HttpVerb.PUT,
            Expires = DateTime.UtcNow.AddHours(duration),
            Protocol = Protocol.HTTPS
        };

        string url = client.GetPreSignedURL(request);
        return Task.FromResult(url);
    }

}









