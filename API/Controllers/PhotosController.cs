
using Application.Contracts;
using Application.Photos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class PhotosController : BaseApiController
{
    private readonly IPhotoAccessor _photoAccessor;

    public PhotosController(IPhotoAccessor photoAccessor)
    {
        _photoAccessor = photoAccessor;
    }

    [AllowAnonymous]
    [HttpGet("{tag}")]
    public async Task<IActionResult> GetCoreImages(string tag)
    {
        return Ok(await _photoAccessor.GetImagesByTag(tag));
    }


    [HttpPost]
    public async Task<IActionResult> Add([FromForm] Add.Command command)
    {
        var result = await Mediator.Send(command);
        return HandleResult(result);
    }

    [HttpPost("{photoId}")]
    public async Task<IActionResult> SetMain(string photoId)
    {
        var result = await Mediator.Send(new SetMain.Command { Id = photoId });
        return HandleResult(result);
    }

    [HttpDelete("{photoId}")]
    public async Task<IActionResult> Delete(string photoId)
    {
        var result = await Mediator.Send(new Delete.Command { Id = photoId });
        return HandleResult(result);
    }
}