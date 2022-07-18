
using Application.Photos;
using Microsoft.AspNetCore.Http;

namespace Application.Contracts;
public interface IPhotoAccessor
{
    Task<PhotoUploadResult> AddPhoto(IFormFile file);
    Task<string> DeletePhoto(string publicId);
}