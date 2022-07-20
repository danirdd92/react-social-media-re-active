
namespace Application.Core;
public class PagingParams
{
    private const int MAX_PAGE_SIZE = 50;

    public int PageNumber { get; set; } = 1;
    private int _pageSIze = 10;
    public int PageSize
    {
        get => _pageSIze;
        set => _pageSIze = (value > MAX_PAGE_SIZE) ? MAX_PAGE_SIZE : value;
    }

}