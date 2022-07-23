
namespace Domain;


public class AssetPhoto
{
    public string Id { get; set; }
    public string Url { get; set; }
}
public class Photo : AssetPhoto
{
    public bool IsMain { get; set; }
}

